import PropTypes from 'prop-types';

export const Balance = ({ value }) => {
    console.log("Balance Value:", value); // Debugging line
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : '0.00';
    return (
        <div className="flex">
            <div className="font-bold text-lg">
                Your Balance:
            </div>
            <div className="font-semibold ml-4 text-lg">
                Rs. {formattedValue}
            </div>
        </div>
    );
};

Balance.propTypes = {
    value: PropTypes.number,
};