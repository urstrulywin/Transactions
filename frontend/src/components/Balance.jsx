import PropTypes from 'prop-types';

export const Balance = ({ value }) => {
    const formattedValue = Number.isFinite(value) ? value.toFixed(2) : '0.00';

    return (
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between max-w-md w-full mx-auto">
            <h2 className="text-gray-600 text-lg font-semibold">Your Balance</h2>
            <p className="text-green-600 text-xl font-bold">₹ {formattedValue}</p>
        </div>
    );
};

Balance.propTypes = {
    value: PropTypes.number,
};
