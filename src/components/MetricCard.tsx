export default function MetricCard({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <li className="mb-3 border-b border-gray-300 pb-2">
      <h1 className="capitalize">{name}</h1>
      <p className="text-sm text-gray-700">{value.toFixed(2)} %</p>
    </li>
  );
}
