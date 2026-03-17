import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Activity } from 'lucide-react';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-xl shadow-primary-500/20 active:scale-95 transition-all duration-300',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all duration-300',
        danger: 'bg-rose-600 text-white hover:bg-rose-500 shadow-xl shadow-rose-500/20 active:scale-95 transition-all duration-300',
        ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300',
    };

    const sizes = {
        sm: 'px-3 py-2 text-xs font-bold leading-none',
        md: 'px-6 py-3 text-sm font-bold leading-none',
        lg: 'px-8 py-4 text-base font-black leading-none uppercase tracking-widest',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-2xl whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="w-full space-y-2">
            {label && <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">{label}</label>}
            <input
                ref={ref}
                className={cn(
                    'flex h-12 w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-2 text-sm font-medium transition-all duration-300 placeholder:text-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-primary-500',
                    error && 'border-rose-500 focus:border-rose-500',
                    className
                )}
                {...props}
            />
            {error && <p className="text-[10px] text-rose-500 font-black uppercase tracking-tighter decoration-rose-500 underline ml-1">{error}</p>}
        </div>
    );
});

export const Card = ({ className, children }) => (
    <div className={cn('bg-white dark:bg-gray-950 rounded-[2rem] border border-gray-100 dark:border-gray-900 shadow-sm transition-shadow duration-500 group', className)}>
        {children}
    </div>
);

export const Table = ({ headers, children, className }) => (
    <div className={cn('w-full overflow-x-auto custom-scrollbar', className)}>
        <table className="w-full text-left">
            <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                    {headers.map((header) => (
                        <th key={header} className="px-10 py-5 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900/50">
                {children}
            </tbody>
        </table>
    </div>
);

export const GlobalLoader = ({ className }) => (
    <div className={cn("flex flex-col items-center justify-center p-12 min-h-[300px] w-full bg-white/40 dark:bg-gray-950/40 backdrop-blur-sm rounded-[2rem] animate-in fade-in duration-500", className)}>
        <div className="relative scale-75 md:scale-100">
            <div className="w-20 h-20 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="text-primary-600 animate-pulse" size={24} />
            </div>
        </div>
        <div className="mt-6 text-center space-y-2">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Synchronizing Data</h3>
            <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                loading backend deployed on render...
            </p>
        </div>
    </div>
);
