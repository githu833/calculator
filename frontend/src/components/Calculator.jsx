import React from 'react';

function Calculator({ formData, handleChange, handleCalculate, handleReset, result, error, onToggleHistory }) {
    const copyToClipboard = (val, label) => {
        navigator.clipboard.writeText(val);
        alert(`${label} copied to clipboard!`);
    };

    return (
        <div className="card">
            <div className="card-header">
                <h1>Capitalize <span style={{ color: 'var(--primary)' }}>Pro</span></h1>
                <button type="button" className="btn-history-toggle" onClick={onToggleHistory}>
                    📜 History
                </button>
            </div>

            <div className="mode-toggle">
                <button
                    type="button"
                    className={`mode-btn ${formData.interestType === 'simple' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'interestType', value: 'simple' } })}
                >
                    Simple
                </button>
                <button
                    type="button"
                    className={`mode-btn ${formData.interestType === 'compound' ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'interestType', value: 'compound' } })}
                >
                    Compound
                </button>
            </div>

            <form onSubmit={handleCalculate}>
                <div className="input-group">
                    <span className="input-label">Investment Principal</span>
                    <input
                        type="number"
                        name="principal"
                        value={formData.principal}
                        onChange={handleChange}
                        placeholder="5,00,000"
                        required
                    />
                </div>

                <div className="input-group">
                    <span className="input-label">Annual Yield (%)</span>
                    <input
                        type="number"
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        placeholder="8.50"
                        step="0.01"
                        required
                    />
                </div>

                <div className="input-group">
                    <span className="input-label">Maturity Period (Years)</span>
                    <input
                        type="number"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        placeholder="10"
                        required
                    />
                </div>

                {error && <div className="error-msg" style={{ color: '#ff4b2b', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

                <div className="action-grid">
                    <button type="submit" className="btn-main">Analyze Yield</button>
                    <button type="button" className="btn-sec" onClick={handleReset}>Clear</button>
                </div>
            </form>

            {result && (
                <div className="luxury-result">
                    <div
                        className="res-card clickable-result"
                        title="Click to copy"
                        onClick={() => copyToClipboard(result.interestAmount, 'Interest')}
                    >
                        <span className="tiny-label">Accrued Interest</span>
                        <span className="res-val">₹{Number(result.interestAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div
                        className="res-card clickable-result"
                        title="Click to copy"
                        onClick={() => copyToClipboard(result.totalAmount, 'Total Portfolio')}
                    >
                        <span className="tiny-label">Total Portfolio</span>
                        <span className="res-val total">₹{Number(result.totalAmount).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calculator;
