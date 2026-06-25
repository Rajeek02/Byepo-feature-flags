import { useState, useEffect } from 'react';
import API from './api';
import './App.css';

function App() {
  const [orgs, setOrgs] = useState([]);
  const [orgId, setOrgId] = useState('');
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orgsLoading, setOrgsLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setOrgsLoading(true);
        const res = await API.get('/user/organizations');
        setOrgs(res.data);
        setError('');
      } catch (err) {
        setError('Unable to load organizations');
      } finally {
        setOrgsLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const handleOrgChange = async (e) => {
    const selected = e.target.value;
    setOrgId(selected);
    setSelectedFeature('');
    setFeatures([]);
    setError('');

    if (!selected) return;

    setLoading(true);
    try {
      const res = await API.get(`/user/organizations/${selected}/flags`);
      setFeatures(res.data);
    } catch (err) {
      setError('Unable to load features');
    } finally {
      setLoading(false);
    }
  };

  const selectedFeatureData = features.find((f) => f._id === selectedFeature) || null;

  return (
    <div className="page-shell">
      <div className="checker-card">
        <h1>Feature Check</h1>

        <div className="field-block">
          <label>Organization</label>
          {orgsLoading ? (
            <div className="input-placeholder">Loading organizations...</div>
          ) : (
            <select value={orgId} onChange={handleOrgChange} className="select-input">
              <option value="">Select Organization</option>
              {orgs.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="field-block">
          <label>Feature</label>
          <select
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            disabled={loading || features.length === 0}
            className="select-input"
          >
            <option value="">
              {loading
                ? 'Loading features...'
                : features.length === 0
                ? 'No feature found for this organization'
                : 'Select Feature'}
            </option>
            {features.map((feature) => (
              <option key={feature._id} value={feature._id}>
                {feature.feature_key}
              </option>
            ))}
          </select>
        </div>

        <div className="status-card">
          <div className="status-title">Current Check Result</div>
          {selectedFeatureData ? (
            <div className={`status-box ${selectedFeatureData.enabled ? 'enabled' : 'disabled'}`}>
              <div className="status-icon">
                {selectedFeatureData.enabled ? '✅' : '❌'}
              </div>
              <div>
                <div className="status-label">
                  Feature is {selectedFeatureData.enabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          ) : (
            <div className="status-placeholder">
              Select an organization and feature to check status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
