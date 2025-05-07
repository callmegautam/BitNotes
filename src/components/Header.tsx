import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className='sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border'>
            <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
                <Link to='/' className='text-2xl font-bold text-primary'>
                    BitNotes
                </Link>
                <div className='flex items-center space-x-4'>
                    <Link to='/' className='text-sm font-medium hover:text-primary transition-colors'>
                        All Projects
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
