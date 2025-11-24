import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-muted/20 pt-20">
                <div className="text-center p-8">
                    <h1 className="text-4xl font-bold mb-4 text-primary">Recordings</h1>
                    <p className="text-xl text-muted-foreground">This page is under construction.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
