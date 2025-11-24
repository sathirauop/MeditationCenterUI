import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProgramHero from '@/components/programs/meditation/ProgramHero';
import DailySchedule from '@/components/programs/meditation/DailySchedule';
import BookingWidget from '@/components/programs/meditation/BookingWidget';
import ProgramGallery from '@/components/programs/meditation/ProgramGallery';

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <ProgramHero />
                <DailySchedule />
                <BookingWidget />
                <ProgramGallery />
            </main>
            <Footer />
        </div>
    );
}
