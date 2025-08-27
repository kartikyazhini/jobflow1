import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function Arrow({ from, to }) {
  const { left: x1, top: y1, width: w1, height: h1 } = from;
  const { left: x2, top: y2, width: w2, height: h2 } = to;
  const startX = x1 + w1;
  const startY = y1 + h1 / 2;
  const endX = x2;
  const endY = y2 + h2 / 2;
  const svgWidth = Math.max(startX, endX) + 40;
  const svgHeight = Math.max(startY, endY) + 40;
  return (
    <svg style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 0 }} width={svgWidth} height={svgHeight}>
      <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)" />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
        </marker>
      </defs>
    </svg>
  );
}

function App() {
  const [job1, setJob1] = useState({ job_status: 'pending', record_count: 0, trigger_time: '' });
  const [job2, setJob2] = useState({ job_status: 'pending', record_count: 0, trigger_time: '' });
  const [job3, setJob3] = useState({ job_status: 'pending', record_count: 0, trigger_time: '' });
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [box1Rect, setBox1Rect] = useState(null);
  const [box2Rect, setBox2Rect] = useState(null);
  const [box3Rect, setBox3Rect] = useState(null);
  const box1Ref = useRef();
  const box2Ref = useRef();
  const box3Ref = useRef();

  useEffect(() => {
    fetch('http://localhost:5000/api/job1')
      .then((res) => res.json())
      .then((data) => {
        setJob1(data);
        setLoading1(false);
        setLoading2(true);
      })
      .catch(() => {
        setLoading1(false);
      });
  }, []);

  useEffect(() => {
    if (!loading1 && job1.job_status === 'success') {
      fetch('http://localhost:5000/api/job2')
        .then((res) => res.json())
        .then((data) => {
          setJob2(data);
          setLoading2(false);
          setLoading3(true);
        })
        .catch(() => {
          setLoading2(false);
        });
    }
  }, [loading1, job1.job_status]);

  useEffect(() => {
    if (!loading2 && job2.job_status === 'success') {
      fetch('http://localhost:5000/api/job3')
        .then((res) => res.json())
        .then((data) => {
          setJob3(data);
          setLoading3(false);
        })
        .catch(() => {
          setLoading3(false);
        });
    }
  }, [loading2, job2.job_status]);

  React.useLayoutEffect(() => {
    function updateRects() {
      if (box1Ref.current) setBox1Rect(box1Ref.current.getBoundingClientRect());
      if (box2Ref.current) setBox2Rect(box2Ref.current.getBoundingClientRect());
      if (box3Ref.current) setBox3Rect(box3Ref.current.getBoundingClientRect());
    }
    updateRects();
    window.addEventListener('resize', updateRects);
    return () => window.removeEventListener('resize', updateRects);
  }, [loading1, loading2, loading3]);

  let box1Color = '#888';
  if (job1.job_status === 'success') box1Color = 'green';
  if (job1.job_status === 'failed') box1Color = 'red';

  let box2Color = '#888';
  if (job2.job_status === 'success') box2Color = 'green';
  if (job2.job_status === 'failed') box2Color = 'red';

  let box3Color = '#888';
  if (job3.job_status === 'success') box3Color = 'green';
  if (job3.job_status === 'failed') box3Color = 'red';

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <h2>Job Progress Tracker</h2>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 60, alignItems: 'center', position: 'relative', minHeight: 80 }}>
        {/* Job 1 */}
        <div
          ref={box1Ref}
          style={{
            width: 180,
            height: 60,
            background: box1Color,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            fontSize: 13,
            boxShadow: '0 2px 8px #0002',
            position: 'relative',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 15 }}>job1</div>
          {loading1 ? (
            <div style={{ fontSize: 11, marginTop: 4 }}>Loading...</div>
          ) : (
            <>
              <div style={{ fontSize: 11, marginTop: 4 }}>Status: {job1.job_status}</div>
              <div style={{ fontSize: 10 }}>Records: {job1.record_count}</div>
              <div style={{ fontSize: 10 }}>Triggered: {job1.trigger_time}</div>
            </>
          )}
        </div>
  {/* Arrow 1-2: Only show when job2 is visible and loaded */}
  {(!loading1 && !loading2 && !loading3 && box1Rect && box2Rect && job2.job_status !== 'pending') && <Arrow from={box1Rect} to={box2Rect} />}
        {/* Job 2: Only show after job1 is loaded and job2 has started loading */}
        {(!loading1 || !loading2 || job2.job_status !== 'pending') && (
          <div
            ref={box2Ref}
            style={{
              width: 180,
              height: 60,
              background: box2Color,
              color: '#fff',
              display: (!loading1 ? 'flex' : 'none'),
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              fontSize: 13,
              boxShadow: '0 2px 8px #0002',
              position: 'relative',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 15 }}>job2</div>
            {loading2 ? (
              <div style={{ fontSize: 11, marginTop: 4 }}>Loading...</div>
            ) : (
              <>
                <div style={{ fontSize: 11, marginTop: 4 }}>Status: {job2.job_status}</div>
                <div style={{ fontSize: 10 }}>Records: {job2.record_count}</div>
                <div style={{ fontSize: 10 }}>Triggered: {job2.trigger_time}</div>
              </>
            )}
          </div>
        )}
  {/* Arrow 2-3: Only show when job3 is visible and loaded */}
  {(!loading2 && !loading3 && box2Rect && box3Rect && job3.job_status !== 'pending') && <Arrow from={box2Rect} to={box3Rect} />}
        {/* Job 3: Only show after job2 is loaded and job2 is not pending */}
        {(!loading2 && job2.job_status !== 'pending') && (
          <div
            ref={box3Ref}
            style={{
              width: 180,
              height: 60,
              background: box3Color,
              color: '#fff',
              display: (!loading2 ? 'flex' : 'none'),
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              fontSize: 13,
              boxShadow: '0 2px 8px #0002',
              position: 'relative',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 15 }}>job3</div>
            {loading3 ? (
              <div style={{ fontSize: 11, marginTop: 4 }}>Loading...</div>
            ) : (
              <>
                <div style={{ fontSize: 11, marginTop: 4 }}>Status: {job3.job_status}</div>
                <div style={{ fontSize: 10 }}>Records: {job3.record_count}</div>
                <div style={{ fontSize: 10 }}>Triggered: {job3.trigger_time}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
