import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Offcanvas, Spinner, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import httpClient from '@/helpers/httpClient';
import { formatCurrency } from '@/utils/currency';

const ServiceMaterialDefaultsOffcanvas = ({ show, service, onHide, onSaved }) => {
  const [catalog, setCatalog] = useState([]);
  const [defaults, setDefaults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    if (!service?.id) return;
    setLoading(true);
    setError('');
    try {
      const [materialsRes, defaultsRes] = await Promise.all([
        httpClient.get('/api/admin/materials', { params: { active: 'true', limit: 100 } }),
        httpClient.get(`/api/admin/services/${service.id}/material-defaults`),
      ]);
      setCatalog(materialsRes.data.materials || []);
      setDefaults(defaultsRes.data.defaults || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load material defaults');
    } finally {
      setLoading(false);
    }
  }, [service?.id]);

  useEffect(() => {
    if (show && service) loadData();
  }, [show, service, loadData]);

  const addDefault = () => {
    const first = catalog.find((item) => !defaults.some((entry) => entry.materialId === item.id));
    if (!first) return;
    setDefaults((prev) => [
      ...prev,
      {
        materialId: first.id,
        name: first.name,
        unit: first.unit,
        defaultUnitPrice: first.defaultUnitPrice,
        defaultQuantity: 1,
      },
    ]);
  };

  const updateDefault = (index, field, value) => {
    setDefaults((prev) => prev.map((item, i) => {
      if (i !== index) return item;
      if (field === 'materialId') {
        const material = catalog.find((entry) => entry.id === Number(value));
        return {
          ...item,
          materialId: Number(value),
          name: material?.name || item.name,
          unit: material?.unit || item.unit,
          defaultUnitPrice: material?.defaultUnitPrice ?? item.defaultUnitPrice,
        };
      }
      return { ...item, [field]: value };
    }));
  };

  const removeDefault = (index) => {
    setDefaults((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!service?.id) return;
    setSaving(true);
    setError('');
    try {
      const res = await httpClient.put(`/api/admin/services/${service.id}/material-defaults`, {
        defaults: defaults.map((item) => ({
          materialId: item.materialId,
          defaultQuantity: Number(item.defaultQuantity) || 1,
        })),
      });
      setDefaults(res.data.defaults || []);
      onSaved?.();
      onHide();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save defaults');
    } finally {
      setSaving(false);
    }
  };

  const availableToAdd = catalog.some((item) => !defaults.some((entry) => entry.materialId === item.id));

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: 'min(520px, 100vw)' }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Default Materials</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {service && (
          <p className="text-muted small">
            Suggested supplies for <strong>{service.name}</strong>. Technicians see these when completing jobs.
          </p>
        )}

        {error && <div className="alert alert-danger py-2">{error}</div>}

        {loading ? (
          <div className="text-center py-4"><Spinner size="sm" /></div>
        ) : (
          <>
            {defaults.length > 0 ? (
              <Table responsive size="sm" className="mb-3">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Default qty</th>
                    <th>Price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {defaults.map((item, index) => (
                    <tr key={`${item.materialId}-${index}`}>
                      <td>
                        <Form.Select
                          size="sm"
                          value={item.materialId}
                          onChange={(e) => updateDefault(index, 'materialId', e.target.value)}
                        >
                          {catalog.map((material) => (
                            <option key={material.id} value={material.id}>{material.name}</option>
                          ))}
                        </Form.Select>
                      </td>
                      <td style={{ width: 90 }}>
                        <Form.Control
                          size="sm"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.defaultQuantity}
                          onChange={(e) => updateDefault(index, 'defaultQuantity', e.target.value)}
                        />
                      </td>
                      <td className="text-nowrap">{formatCurrency(item.defaultUnitPrice)}/{item.unit}</td>
                      <td className="text-end">
                        <Button size="sm" variant="link" className="text-danger p-0" onClick={() => removeDefault(index)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-muted small">No default materials configured for this service.</p>
            )}

            <Button
              size="sm"
              variant="outline-primary"
              className="mb-4"
              onClick={addDefault}
              disabled={!availableToAdd}
            >
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add material
            </Button>

            <div className="mt-auto d-flex gap-2 pt-3 border-top">
              <Button variant="light" className="flex-grow-1" onClick={onHide} disabled={saving}>Cancel</Button>
              <Button className="flex-grow-1" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Defaults'}
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ServiceMaterialDefaultsOffcanvas;
