import DogForm from '@/components/admin/DogForm';

export default async function EditDogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DogForm rowId={id} />;
}
