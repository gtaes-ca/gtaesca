import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const PageAccessPage = () => {
  const { showNotification } = useNotificationContext();
  const [pages, setPages] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] = useState(null);

  const loadMatrix = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/page-access');
      setPages(res.data.pages || []);
      setRoles(res.data.roles || []);
      setAssignments(res.data.assignments || {});
    } catch (error) {
      showNotification({
        message: error.response?.data?.error || 'Failed to load page access settings',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadMatrix();
  }, [loadMatrix]);

  const groupedPages = useMemo(() => {
    const groups = new Map();
    for (const page of pages) {
      const groupLabel = page.groupLabel || 'Other';
      if (!groups.has(groupLabel)) {
        groups.set(groupLabel, []);
      }
      groups.get(groupLabel).push(page);
    }
    return [...groups.entries()];
  }, [pages]);

  const togglePage = (role, pageKey) => {
    setAssignments((current) => {
      const rolePages = new Set(current[role] || []);
      if (rolePages.has(pageKey)) {
        rolePages.delete(pageKey);
      } else {
        rolePages.add(pageKey);
      }
      return { ...current, [role]: [...rolePages] };
    });
  };

  const handleSaveRole = async (role) => {
    setSavingRole(role);
    try {
      await httpClient.put(`/api/admin/page-access/${role}`, {
        pageKeys: assignments[role] || [],
      });
      showNotification({
        message: 'Page access updated. Users with this role must sign in again.',
        variant: 'success',
      });
      await loadMatrix();
    } catch (error) {
      showNotification({
        message: error.response?.data?.error || 'Failed to save page access',
        variant: 'danger',
      });
    } finally {
      setSavingRole(null);
    }
  };

  return (
    <>
      <PageMetaData title="Page Access" />
      <ComponentContainerCard
        title="Page Access"
        description="Assign which admin pages each role can open. Super admins always have full access. Saving changes signs out active sessions for the affected role."
      >
        {loading ? (
          <p className="text-muted mb-0">Loading page access settings...</p>
        ) : (
          <div className="table-responsive">
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ minWidth: 220 }}>Page</th>
                  {roles.map((role) => (
                    <th key={role.role} className="text-center" style={{ minWidth: 130 }}>
                      <div>{role.label}</div>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="mt-2"
                        disabled={savingRole === role.role}
                        onClick={() => handleSaveRole(role.role)}
                      >
                        {savingRole === role.role ? 'Saving...' : 'Save'}
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedPages.map(([groupLabel, groupPages]) => (
                  <Fragment key={groupLabel}>
                    <tr>
                      <td colSpan={roles.length + 1} className="bg-body-tertiary fw-semibold border-0">
                        {groupLabel}
                      </td>
                    </tr>
                    {groupPages.map((page) => (
                      <tr key={page.key}>
                        <td>
                          <div className="fw-medium">{page.label}</div>
                          <div className="text-muted small">{page.path}</div>
                        </td>
                        {roles.map((role) => (
                          <td key={`${page.key}-${role.role}`} className="text-center">
                            <Form.Check
                              type="checkbox"
                              className="d-inline-flex m-0"
                              checked={(assignments[role.role] || []).includes(page.key)}
                              onChange={() => togglePage(role.role, page.key)}
                              aria-label={`${page.label} for ${role.label}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {!loading && (
          <div className="mt-3 p-3 rounded bg-body-tertiary border border-secondary-subtle">
            <span className="text-body-secondary small">
              Super Admin always has access to every page, including this settings screen.
            </span>
          </div>
        )}
      </ComponentContainerCard>
    </>
  );
};

export default PageAccessPage;
