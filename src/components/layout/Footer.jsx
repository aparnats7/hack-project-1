import { LockIcon, GithubIcon, TwitterIcon, LinkedinIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center">
              <LockIcon className="w-6 h-6 text-primary mr-2" />
              <span className="font-bold text-lg tracking-tight">SecureAI</span>
            </div>
            <p className="text-muted-foreground text-sm">
              AI-powered secure document verification with blockchain technology.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Press</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Partners</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Documentation</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Data Protection</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 mt-10 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SecureAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
