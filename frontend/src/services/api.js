const API_BASE = '/api';

export async function uploadDatasetFile(file, sessionId = 'default_session') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('session_id', sessionId);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Failed to upload dataset file' }));
    throw new Error(errData.detail || 'Upload failed');
  }

  return await res.json();
}

export async function updateTargetAnalysis(targetColumn, problemType = null, sessionId = 'default_session') {
  const res = await fetch(`${API_BASE}/analyze-target`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      target_column: targetColumn,
      problem_type: problemType,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Failed to re-analyze dataset' }));
    throw new Error(errData.detail || 'Re-analysis failed');
  }

  return await res.json();
}

export async function getSampleDatasets() {
  const res = await fetch(`${API_BASE}/sample-datasets`);
  if (!res.ok) {
    throw new Error('Failed to fetch sample datasets');
  }
  return await res.json();
}

export async function loadSampleDataset(filename, sessionId = 'default_session') {
  const res = await fetch(`${API_BASE}/sample-dataset/${filename}?session_id=${sessionId}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: 'Failed to load sample dataset' }));
    throw new Error(errData.detail || 'Loading sample dataset failed');
  }
  return await res.json();
}
