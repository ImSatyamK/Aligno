import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh w-full flex-col md:flex-row overflow-hidden">
            
            <div className="order-2 md:order-1 flex flex-1 items-center justify-center px-4 py-6 md:py-8">
                {children}
            </div>

            <div className="order-1 md:order-2 flex flex-1 items-center justify-center px-4 py-4 md:py-8">
                <Image
                    src="/logo_light.png"
                    alt="Aligno"
                    width={100}
                    height={100}
                    className="block dark:hidden w-14 h-14 md:w-64 md:h-64 object-contain"
                />
                <Image
                    src="/logo_dark.png"
                    alt="Aligno"
                    width={100}
                    height={100}
                    className="hidden dark:block w-14 h-14 md:w-64 md:h-64 object-contain"
                />
            </div>

        </div>
    );
}