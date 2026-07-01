import { useCallback, useEffect, useState } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import httpClient from '@/helpers/httpClient';
import { useNotificationContext } from '@/context/useNotificationContext';
import AnalyticsDateFilter from './components/AnalyticsDateFilter';
import Conversions from './components/Conversions';
import SessionByBrowser from './components/SessionByBrowser';
import SessionsByCountry from './components/SessionsByCountry';
import Stats from './components/Stats';
import TopPages from './components/TopPages';

function defaultCustomRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export default function Home() {
  const { showNotification } = useNotificationContext();
  const [preset, setPreset] = useState('7d');
  const [customRange, setCustomRange] = useState(defaultCustomRange);
  const [customFrom, setCustomFrom] = useState(customRange.from);
  const [customTo, setCustomTo] = useState(customRange.to);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = { preset };
      if (preset === 'custom') {
        params.from = customRange.from;
        params.to = customRange.to;
      }
      const res = await httpClient.get('/api/admin/analytics', { params });
      setAnalytics(res.data.analytics);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load analytics',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [preset, customRange.from, customRange.to, showNotification]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handlePresetChange = (nextPreset) => {
    setPreset(nextPreset);
    if (nextPreset === 'custom') {
      setCustomFrom(customRange.from);
      setCustomTo(customRange.to);
    }
  };

  const applyCustomRange = () => {
    setCustomRange({ from: customFrom, to: customTo });
    setPreset('custom');
  };

  const rangeLabel = analytics?.range
    ? `${analytics.range.from} → ${analytics.range.to}`
    : null;

  return (
    <>
      <PageBreadcrumb title="Analytics" subName="Dashboards" />
      <PageMetaData title="Analytics" />

      <AnalyticsDateFilter
        preset={preset}
        customFrom={customFrom}
        customTo={customTo}
        timezone={analytics?.range?.timezone}
        onPresetChange={handlePresetChange}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
        onApplyCustom={applyCustomRange}
        loading={loading}
      />

      {rangeLabel && (
        <Alert variant="light" className="py-2 px-3 mb-4 border">
          <span className="text-muted small">
            Showing stats for bookings created between <strong>{rangeLabel}</strong>
          </span>
        </Alert>
      )}

      <Row>
        <Col xxl={3}>
          <Stats summary={analytics?.summary} loading={loading} />
        </Col>
        <Col xxl={9}>
          <Conversions analytics={analytics} loading={loading} />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col xs={12}>
          <SessionsByCountry analytics={analytics} loading={loading} />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col lg={4}>
          <SessionByBrowser analytics={analytics} loading={loading} />
        </Col>
        <Col lg={8}>
          <TopPages analytics={analytics} loading={loading} />
        </Col>
      </Row>
    </>
  );
}
