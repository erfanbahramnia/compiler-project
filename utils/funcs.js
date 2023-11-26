function stringTo2DArray(string) {
    let array = string.split(/\n/g);
    for (let index = 0; index < array.length; index++) {
        array[index] = array[index].trim().split(" ");
    };
    // remove unexpected spaces
    array = array.map(items => items.filter(item => item !== ""));

    return array;
};2

function stringTo2DArray2(string) {
    let array = string.split(/\n/g);

    const signs = [",", "(", ")", "{", "}"]
    // const operands = [":", ""]
    for (let index = 0; index < array.length; index++) {
        let line = [];
        let k = 0;
        for (let j = 0; j < array[index].length; j++) {
            if(signs.includes(array[index][j])) {
                line.push(array[index].slice(k, j));
                line.push(array[index][j]);
                k=j+1;
            }
            if(" ".includes(array[index][j])) {
                line.push(array[index].slice(k, j));
                k=j+1;
            }
            if(j === (array[index].length - 1 )) {
                line.push(array[index].slice(k, j+1));
            }
        }
        array[index] = line;
    };
    // remove unexpected spaces
    array = array.map(items => items.filter(item => item !== ""));
    console.log(array)

    return array;
};

export {
    stringTo2DArray,
    stringTo2DArray2
};