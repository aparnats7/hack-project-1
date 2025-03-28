from web3 import Web3
import json
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class BlockchainService:
    def __init__(self):
        self.use_blockchain = os.getenv('USE_BLOCKCHAIN', 'false').lower() == 'true'
        if self.use_blockchain:
            self._initialize_web3()
            
    def _initialize_web3(self):
        """
        Initialize Web3 connection to Ethereum network
        """
        try:
            # Connect to Ethereum network (local or remote)
            provider_url = os.getenv('ETHEREUM_PROVIDER_URL', 'http://localhost:8545')
            self.w3 = Web3(Web3.HTTPProvider(provider_url))
            
            # Load contract ABI and address
            contract_path = os.path.join(os.path.dirname(__file__), '../../contracts/VerificationContract.json')
            with open(contract_path) as f:
                contract_data = json.load(f)
                self.contract_abi = contract_data['abi']
                self.contract_address = contract_data['address']
                
            # Initialize contract
            self.contract = self.w3.eth.contract(
                address=self.contract_address,
                abi=self.contract_abi
            )
            
            # Set default account
            self.w3.eth.default_account = os.getenv('ETHEREUM_ACCOUNT')
            
        except Exception as e:
            print(f"Error initializing Web3: {str(e)}")
            self.w3 = None
            
    def record_verification(self, document_id, verification_results):
        """
        Record verification results on the blockchain
        """
        if not self.use_blockchain or not self.w3:
            return {
                'status': 'simulated',
                'timestamp': datetime.utcnow().isoformat(),
                'document_id': document_id
            }
            
        try:
            # Prepare verification data
            verification_data = {
                'document_id': document_id,
                'timestamp': datetime.utcnow().isoformat(),
                'results': verification_results
            }
            
            # Convert to JSON string
            data_json = json.dumps(verification_data)
            
            # Create transaction
            tx_hash = self.contract.functions.recordVerification(
                document_id,
                data_json
            ).transact()
            
            # Wait for transaction receipt
            tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                'status': 'success',
                'transaction_hash': tx_hash.hex(),
                'block_number': tx_receipt['blockNumber'],
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"Error recording verification on blockchain: {str(e)}")
            return {
                'status': 'error',
                'message': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
            
    def get_verification_history(self, document_id):
        """
        Retrieve verification history from blockchain
        """
        if not self.use_blockchain or not self.w3:
            return []
            
        try:
            # Get verification events for document
            events = self.contract.events.VerificationRecorded.get_logs(
                fromBlock=0,
                toBlock='latest',
                argument_filters={'documentId': document_id}
            )
            
            history = []
            for event in events:
                verification_data = json.loads(event['args']['data'])
                history.append({
                    'timestamp': verification_data['timestamp'],
                    'results': verification_data['results'],
                    'transaction_hash': event['transactionHash'].hex(),
                    'block_number': event['blockNumber']
                })
                
            return history
            
        except Exception as e:
            print(f"Error retrieving verification history: {str(e)}")
            return [] 