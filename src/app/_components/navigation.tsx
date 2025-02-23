import Link from 'next/link';
import { GoHome, GoHomeFill, GoSearch, GoPackage, GoInfo, GoCheck, GoCheckCircleFill, GoCheckCircle, GoFile, GoFileDirectoryFill, GoFileDirectory, GoSquare, GoSquareFill } from 'react-icons/go';
import { cn } from '~/lib/utils';

const routes = [
    {
        label: 'Home',
        href: '/',
        icon: GoHome,
        activation: GoHomeFill
    },
    {
        label: 'Explore',
        href: '/explore',
        icon: GoCheckCircle,
        activation: GoCheckCircleFill
    },
    {
        label: 'My Capsules',
        href: '/my-capsules',
        icon: GoFileDirectory,
        activation: GoFileDirectoryFill
    },
    {
        label: 'About',
        href: '/about',
        icon: GoSquare,
        activation: GoSquareFill
    }
]

export const Navigation = () => {
    return (
        <ul className='flex flex-col'>
            {routes.map((item) => {
                const isActive = false;
                const Icon = isActive ? item.activation : item.icon;
                return (
                    <Link key={item.href} href={item.href}>
                        <div className={cn('flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500', isActive && 'bg-white shadow-sm hover:opacity-100 text-primary')}>
                            <Icon className='size-5 text-neutral-500' />
                            {item.label}
                        </div>
                    </Link>
                )
            })}
        </ul>
    )
}