
const Footer = () => {
    return (
        <footer className="w-full py-6 mt-12 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex flex-col items-center justify-center gap-4 text-center md:h-16 md:flex-row md:justify-between md:py-0">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} <a href="https://jeyanthangj.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">Jeyanthan GJ</a>. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <a href="https://jeyanthangj.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        Portfolio
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
