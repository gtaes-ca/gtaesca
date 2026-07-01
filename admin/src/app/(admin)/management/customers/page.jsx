import { useEffect, useState } from 'react';
import { Badge, Table } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const CustomersPage = () => {
  const { showNotification } = useNotificationContext();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await httpClient.get('/api/admin/users/customers');
        setCustomers(res.data.customers || []);
      } catch (e) {
        showNotification({
          message: e.response?.data?.error || 'Failed to load customers',
          variant: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, [showNotification]);

  return (
    <>
      <PageMetaData title="Online Customers" />
      <ComponentContainerCard
        title="Online Customers"
        description="Customers who register from the web for electrical services."
      >
        {loading ? <p className="text-muted">Loading...</p> : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Email Verified</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-'}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td><Badge bg={customer.status === 'active' ? 'success' : 'secondary'}>{customer.status}</Badge></td>
                  <td>{customer.emailVerified ? 'Yes' : 'No'}</td>
                  <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={6} className="text-muted">No online customers yet.</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>
    </>
  );
};

export default CustomersPage;
