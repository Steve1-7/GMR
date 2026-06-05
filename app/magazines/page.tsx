import MagazineShowcase from '@/components/home/magazine-showcase';

export const metadata = {
  title: 'Magazines - Gold-Coast Mining Review',
  description: 'Browse the latest issues of Gold-Coast Mining Review',
};

export default function Page() {
  return (
    <main>
      <MagazineShowcase />
    </main>
  );
}
