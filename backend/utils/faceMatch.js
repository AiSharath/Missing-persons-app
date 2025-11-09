// utils/faceMatch.js

export function euclideanDistance(arr1, arr2) {
  if (!arr1 || !arr2) {
    console.warn("One or both descriptors are null/undefined");
    return Infinity;
  }
  
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    console.warn("Descriptors must be arrays", {
      arr1Type: typeof arr1,
      arr2Type: typeof arr2
    });
    return Infinity;
  }
  
  if (arr1.length !== arr2.length) {
    console.warn(`Descriptor length mismatch: ${arr1.length} vs ${arr2.length}`);
    return Infinity;
  }

  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    const diff = arr1[i] - arr2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export function findBestMatch(queryDescriptor, persons) {
  if (!queryDescriptor || !Array.isArray(queryDescriptor) || queryDescriptor.length === 0) {
    console.error("Invalid query descriptor");
    return { match: null, distance: Infinity };
  }

  if (!persons || persons.length === 0) {
    console.warn("No persons provided for matching");
    return { match: null, distance: Infinity };
  }

  let bestMatch = null;
  let bestDistance = Infinity;
  const threshold = 0.6; // recommended for mobileNet models

  console.log(`Matching against ${persons.length} persons with query descriptor length: ${queryDescriptor.length}`);

  persons.forEach((person, index) => {
    if (!person.faceDescriptor) {
      console.warn(`Person ${index} (${person.name || 'unknown'}) has no faceDescriptor`);
      return;
    }

    if (!Array.isArray(person.faceDescriptor) || person.faceDescriptor.length === 0) {
      console.warn(`Person ${index} (${person.name || 'unknown'}) has invalid faceDescriptor`);
      return;
    }

    const distance = euclideanDistance(queryDescriptor, person.faceDescriptor);
    
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = person;
      console.log(`New best match: ${person.name} with distance ${distance.toFixed(4)}`);
    }
  });

  console.log(`Best match result: ${bestMatch ? bestMatch.name : 'none'}, distance: ${bestDistance.toFixed(4)}, threshold: ${threshold}`);

  if (bestDistance <= threshold) {
    return { match: bestMatch, distance: bestDistance };
  }
  return { match: null, distance: bestDistance };
}
