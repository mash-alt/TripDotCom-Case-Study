interface StatusMessageProps {
  title: string;
  description: string;
}

export default function StatusMessage({ title, description }: StatusMessageProps) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-8 text-center shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
