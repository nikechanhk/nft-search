import _ from 'lodash';

const resultFormat = (
    results: { id: string; rank?: number; price: number }[],
    extraField?: string,
) => {
    let resultString = '';

    for (const result of results) {
        resultString = `${resultString}\nid: ${result.id} price: ${result.price} rank: ${result.rank}`;
        if (extraField != null) {
            resultString = `${resultString} ${extraField}: ${_.get(
                result,
                extraField,
            )}`;
        }
    }

    return resultString;
};

export default resultFormat;
