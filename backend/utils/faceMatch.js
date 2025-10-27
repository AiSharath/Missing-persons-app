// utils/faceMatch.js

export function euclideanDistance(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return Infinity;

  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += Math.pow(arr1[i] - arr2[i], 2);
  }
  return Math.sqrt(sum);
}

export function findBestMatch(queryDescriptor, persons) {
  let bestMatch = null;
  let bestDistance = Infinity;
  const threshold = 0.6; // recommended for mobileNet models

  persons.forEach(person => {
    const distance = euclideanDistance(queryDescriptor, person.faceDescriptor);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = person;
    }
  });

  if (bestDistance <= threshold) {
    return { match: bestMatch, distance: bestDistance };
  }
  return { match: null, distance: bestDistance };
}
