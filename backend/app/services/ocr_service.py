import pytesseract
from PIL import Image
import os
from google.cloud import vision
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

class OCRService:
    def __init__(self):
        self.use_google_vision = os.getenv('USE_GOOGLE_VISION', 'false').lower() == 'true'
        if self.use_google_vision:
            self.client = vision.ImageAnnotatorClient()
            
    def extract_text(self, image_path):
        """
        Extract text from an image using either Tesseract OCR or Google Cloud Vision API
        """
        if self.use_google_vision:
            return self._extract_text_google_vision(image_path)
        else:
            return self._extract_text_tesseract(image_path)
            
    def _extract_text_tesseract(self, image_path):
        """
        Extract text using Tesseract OCR
        """
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            print(f"Error in Tesseract OCR: {str(e)}")
            return ""
            
    def _extract_text_google_vision(self, image_path):
        """
        Extract text using Google Cloud Vision API
        """
        try:
            with open(image_path, 'rb') as image_file:
                content = image_file.read()
                
            image = vision.Image(content=content)
            
            response = self.client.text_detection(image=image)
            texts = response.text_annotations
            
            if texts:
                return texts[0].description.strip()
            return ""
            
        except Exception as e:
            print(f"Error in Google Vision API: {str(e)}")
            return ""
            
    def analyze_document(self, image_path):
        """
        Perform comprehensive document analysis
        """
        text = self.extract_text(image_path)
        
        # Add additional analysis features here
        # For example, layout analysis, form field detection, etc.
        
        return {
            'extracted_text': text,
            'confidence_score': 0.8,  # Placeholder
            'analysis_timestamp': datetime.utcnow().isoformat()
        } 