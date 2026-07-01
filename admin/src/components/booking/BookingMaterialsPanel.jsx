import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Col, Form, Row, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';
import { formatCurrency } from '@/utils/currency';

const emptyForm = {
  materialId: '',
  name: '',
  unit: 'each',
  quantity: '1',
  unitPrice: '',
  notes: '',
};

function BookingMaterialsPanel({
  booking,
  onBookingUpdated,
  disabled = false,
  mode = 'admin',
  suggestedMaterials = [],
}) {
  const { showNotification } = useNotificationContext();
  const [catalog, setCatalog] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [addingSuggestedId, setAddingSuggestedId] = useState(null);

  const apiBase = mode === 'technician'
    ? `/api/technician/bookings/${booking?.id}`
    : `/api/admin/bookings/${booking?.id}`;

  const loadCatalog = useCallback(async () => {
    try {
      const url = mode === 'technician' ? '/api/technician/materials' : '/api/admin/materials';
      const res = await httpClient.get(url, {
        params: mode === 'admin'
          ? { active: 'true', limit: 100, sortBy: 'name', sortDir: 'asc' }
          : undefined,
      });
      setCatalog(res.data.materials || []);
    } catch {
      setCatalog([]);
    }
  }, [mode]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const materials = booking?.materials || [];

  const selectedCatalogItem = useMemo(
    () => catalog.find((item) => String(item.id) === form.materialId),
    [catalog, form.materialId]
  );

  const pendingSuggestions = useMemo(() => {
    const usedMaterialIds = new Set(materials.map((item) => item.materialId).filter(Boolean));
    return suggestedMaterials.filter((item) => !usedMaterialIds.has(item.materialId));
  }, [materials, suggestedMaterials]);

  const handleCatalogChange = (materialId) => {
    const item = catalog.find((entry) => String(entry.id) === materialId);
    setForm((prev) => ({
      ...prev,
      materialId,
      name: item?.name || '',
      unit: item?.unit || 'each',
      unitPrice: item ? String(item.defaultUnitPrice) : '',
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const addMaterial = async (payload) => {
    if (!booking?.id) return;
    setSubmitting(true);
    try {
      const res = await httpClient.post(`${apiBase}/materials`, payload);
      onBookingUpdated(res.data.booking);
      resetForm();
      showNotification({ message: 'Material added to booking', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to add material',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMaterial({
      materialId: form.materialId ? Number(form.materialId) : undefined,
      name: form.name.trim(),
      unit: form.unit.trim() || 'each',
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
      notes: form.notes.trim() || undefined,
    });
  };

  const addSuggested = async (suggestion) => {
    if (!booking?.id) return;
    setAddingSuggestedId(suggestion.materialId);
    try {
      const res = await httpClient.post(`${apiBase}/materials`, {
        materialId: suggestion.materialId,
        quantity: suggestion.defaultQuantity,
      });
      onBookingUpdated(res.data.booking);
      showNotification({ message: `${suggestion.name} added`, variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to add suggested material',
        variant: 'danger',
      });
    } finally {
      setAddingSuggestedId(null);
    }
  };

  const removeMaterial = async (lineId) => {
    if (!booking?.id) return;
    setRemovingId(lineId);
    try {
      const res = await httpClient.delete(`${apiBase}/materials/${lineId}`);
      onBookingUpdated(res.data.booking);
      showNotification({ message: 'Material removed', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to remove material',
        variant: 'danger',
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="border rounded p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Materials & Supplies</h6>
        <small className="text-muted">{materials.length} item{materials.length === 1 ? '' : 's'}</small>
      </div>

      {!disabled && pendingSuggestions.length > 0 && (
        <div className="mb-3">
          <div className="small text-muted mb-2">Suggested for this service</div>
          <div className="d-flex flex-wrap gap-2">
            {pendingSuggestions.map((item) => (
              <Button
                key={item.materialId}
                size="sm"
                variant="outline-secondary"
                disabled={addingSuggestedId === item.materialId || submitting}
                onClick={() => addSuggested(item)}
              >
                {addingSuggestedId === item.materialId ? 'Adding...' : (
                  <>
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    {item.name} ({item.defaultQuantity} {item.unit})
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {materials.length > 0 ? (
        <Table responsive size="sm" className="mb-3">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {materials.map((item) => (
              <tr key={item.id}>
                <td>
                  <div>{item.name}</div>
                  {item.notes && <small className="text-muted">{item.notes}</small>}
                </td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td className="fw-medium">{formatCurrency(item.lineTotal)}</td>
                <td className="text-end">
                  {!disabled && (
                    <Button
                      size="sm"
                      variant="link"
                      className="text-danger p-0"
                      disabled={removingId === item.id}
                      onClick={() => removeMaterial(item.id)}
                    >
                      {removingId === item.id ? '...' : 'Remove'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted small mb-3">No materials added yet.</p>
      )}

      <div className="bg-light rounded p-2 small mb-3">
        <div className="d-flex justify-content-between">
          <span>Services</span>
          <span>{formatCurrency(booking?.servicePrice || 0)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Materials</span>
          <span>{formatCurrency(booking?.materialsTotal || 0)}</span>
        </div>
        <div className="d-flex justify-content-between fw-semibold border-top pt-2 mt-2">
          <span>Total</span>
          <span>{formatCurrency(booking?.totalPrice || booking?.servicePrice || 0)}</span>
        </div>
      </div>

      {!disabled && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label className="small mb-1">From catalog</Form.Label>
            <Form.Select
              size="sm"
              value={form.materialId}
              onChange={(e) => handleCatalogChange(e.target.value)}
            >
              <option value="">Custom item...</option>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {formatCurrency(item.defaultUnitPrice)}/{item.unit}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {!form.materialId && (
            <Form.Group className="mb-2">
              <Form.Label className="small mb-1">Custom name</Form.Label>
              <Form.Control
                size="sm"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required={!form.materialId}
              />
            </Form.Group>
          )}

          <Row className="g-2 mb-2">
            <Col xs={4}>
              <Form.Label className="small mb-1">Qty</Form.Label>
              <Form.Control
                size="sm"
                type="number"
                min="0.01"
                step="0.01"
                value={form.quantity}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                required
              />
            </Col>
            <Col xs={4}>
              <Form.Label className="small mb-1">Unit</Form.Label>
              <Form.Control
                size="sm"
                value={form.unit}
                onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                required
              />
            </Col>
            <Col xs={4}>
              <Form.Label className="small mb-1">Price</Form.Label>
              <Form.Control
                size="sm"
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(e) => setForm((prev) => ({ ...prev, unitPrice: e.target.value }))}
                required
              />
            </Col>
          </Row>

          {selectedCatalogItem && (
            <p className="text-muted small mb-2">
              Using catalog price for {selectedCatalogItem.name}. You can override the price above.
            </p>
          )}

          <Button type="submit" size="sm" disabled={submitting}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            {submitting ? 'Adding...' : 'Add Material'}
          </Button>
        </Form>
      )}
    </div>
  );
}

export default BookingMaterialsPanel;
