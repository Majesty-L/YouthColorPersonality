export const getTopThree = (data, index) => {
  return data.sort((a,b)=>b[index]-a[index]).slice(0, 3);
}
export const convertTo26Base = (number) => {
  let result = '';
  while (number > 0) {
    number--;
    let remainder = number % 26;
    result = String.fromCharCode(65 + remainder) + result;
    number = Math.floor(number / 26);
  }
  return result;
}
export const swapElements = (array, index1, index2) => {
  [array[index1], array[index2]] = [array[index2], array[index1]];
}
export const swapObjects = (array, index1, index2, that) => {
  // 使用$set方法交换数组中的两个元素
  const temp = array[index1];
  that.$set(array, index1, array[index2]);
  that.$set(array, index2, temp);
}
export const convertToLetter = (number) => {
  return String.fromCharCode(65 + number);
}

// 排序题的选项
export const getCombinations = (arr, k) => {
  const combinations = [];

  function backtrack(startIndex, currentCombination) {
    if (currentCombination.length === k) {
      combinations.push([...currentCombination]);
      return;
    }

    for (let i = startIndex; i < arr.length; i++) {
      currentCombination.push(arr[i]);
      backtrack(i + 1, currentCombination);
      currentCombination.pop();
    }
  }

  backtrack(0, []);
  return combinations;
}