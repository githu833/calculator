import React from 'react';

function History({ history }) {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2>Portfolio History</h2>
            <div className="inquiry-feed">
                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '4rem' }}>
                        <p>No transactions indexed.</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item._id} className="inquiry-card">
                            <div className="inquiry-meta">
                                <span className="badge">{item.interestType}</span>
                                <span className="tiny-label">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="inquiry-grid">
                                <div className="inquiry-stat">
                                    <span className="tiny-label">Base</span>
                                    <span className="bold-val">₹{Number(item.principal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="inquiry-stat">
                                    <span className="tiny-label">Yield</span>
                                    <span className="bold-val" style={{ color: 'var(--primary)' }}>
                                        +{item.rate}%
                                    </span>
                                </div>
                                <div className="inquiry-stat">
                                    <span className="tiny-label">Gain</span>
                                    <span className="bold-val" style={{ color: 'var(--primary)' }}>
                                        ₹{Number(item.interestAmount).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="inquiry-stat">
                                    <span className="tiny-label">Maturity</span>
                                    <span className="bold-val">
                                        ₹{Number(item.totalAmount).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default History;
