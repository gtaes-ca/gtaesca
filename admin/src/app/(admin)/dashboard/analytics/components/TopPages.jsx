import { Badge, Card, CardHeader, CardTitle, Table } from 'react-bootstrap';
import { formatCurrency } from '@/utils/currency';

const TopPages = ({ analytics, loading }) => {
  const services = analytics?.topServices || [];
  const materials = analytics?.topMaterials || [];

  return (
    <Card className="h-100">
      <CardHeader className="border-bottom border-dashed">
        <CardTitle className="mb-0">Top Services &amp; Materials</CardTitle>
      </CardHeader>
      <div className="table-responsive">
        <Table hover className="table-nowrap table-centered m-0">
          <thead className="bg-body-secondary">
            <tr>
              <th className="text-muted py-2">Item</th>
              <th className="text-muted py-2">Type</th>
              <th className="text-muted py-2">Bookings / Qty</th>
              <th className="text-muted py-2 text-end">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="text-muted">Loading...</td>
              </tr>
            )}
            {!loading && services.map((service) => (
              <tr key={`service-${service.serviceName}`}>
                <td className="fw-medium">{service.serviceName}</td>
                <td><Badge bg="primary-subtle" text="primary">Service</Badge></td>
                <td>{service.count}</td>
                <td className="text-end">{formatCurrency(service.revenue)}</td>
              </tr>
            ))}
            {!loading && materials.map((material) => (
              <tr key={`material-${material.name}-${material.unit}`}>
                <td className="fw-medium">{material.name}</td>
                <td><Badge bg="secondary-subtle" text="secondary">Material</Badge></td>
                <td>{material.quantity} {material.unit}</td>
                <td className="text-end">{formatCurrency(material.revenue)}</td>
              </tr>
            ))}
            {!loading && services.length === 0 && materials.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted">No service or material data in this period.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default TopPages;
