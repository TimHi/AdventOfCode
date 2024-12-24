import * as fs from "fs";

const isSample = true;

function mod(dividend: number, modulus: number): number {
  return ((dividend % modulus) + modulus) % modulus;
}

function calcNewSecret(secret: number): number {
  secret ^= secret * 64;
  secret = mod(secret, 16777216);

  secret ^= secret / 32;
  secret = mod(secret, 16777216);

  secret ^= secret * 2048;
  secret = mod(secret, 16777216);

  return secret;
}

function getSumOfSequentiellSecretNumbers(secrets: number[], n: number): number {
  const newNumbers: number[] = [];
  secrets.forEach((secret) => {
    let tSec = secret;
    for (let i = 0; i < n; i++) {
      tSec = calcNewSecret(tSec);
    }
    newNumbers.push(tSec);
  });

  const sum = newNumbers.reduce((acc, curr) => {
    return acc + curr;
  });
  return sum;
}

export function SolvePartOne(): number {
  const fileName = isSample ? "/src/days/day22/sample.txt" : "/src/days/day22/full.txt";

  const secrets = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => Number(line));

  return getSumOfSequentiellSecretNumbers(secrets, 2000);
}

function getLastDigit(n: number): number {
  const last = mod(n, 10);
  return last;
}

function getPriceMap(secret: number, n: number): Map<string, number> {
  const priceMap = new Map<string, number>();
  const calcedSecrets: number[] = [secret];
  let tSec = secret;
  for (let i = 0; i < n; i++) {
    tSec = calcNewSecret(tSec);
    calcedSecrets.push(tSec);
  }

  //4 blocks put changes into pricemap
  for (let i = 1; i < calcedSecrets.length - 3; i++) {
    let combi = "";
    let highestNum = 0;
    for (let j = 0; j < 4; j++) {
      const first = getLastDigit(calcedSecrets[i + j]);
      const second = getLastDigit(calcedSecrets[i + j - 1]);
      combi += String(first - second);
      if (j !== 3) {
        combi += ",";
      } else {
        //Final step, get the resulting sell number and put it with the combination into the map
        const sellNum = getLastDigit(calcedSecrets[i + j]);
        if (sellNum > highestNum) {
          highestNum = sellNum;
          if (priceMap.has(combi)) {
            const num = priceMap.get(combi);
            if (num !== undefined) {
              if (highestNum > num) {
                priceMap.set(combi, highestNum);
              }
            }
          } else {
            priceMap.set(combi, highestNum);
          }
        }
      }
    }
  }

  return priceMap;
}

function getHighestCombo(priceMap: Map<string, number>): [string, number] {
  let hNum = 0;
  let c = "";
  priceMap.forEach((v, k) => {
    if (v > hNum) {
      hNum = v;
      c = k;
    }
  });
  return [c, hNum];
}

export function SolvePartTwo(): number {
  const fileName = isSample ? "/src/days/day22/sample.txt" : "/src/days/day22/full.txt";

  const secrets = fs
    .readFileSync(process.cwd() + fileName, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => Number(line));

  const allNumsMap: Map<string, number>[] = [];
  secrets.forEach((secret) => {
    //For each Monkey/Price the Key contains the changes eg "-3,6,-1,-1", value is the possible created sell price
    const priceMap = getPriceMap(secret, 2000);
    allNumsMap.push(priceMap);
  });
  const toTestCombos: string[] = [];
  allNumsMap.forEach((map) => {
    map.forEach((v, k) => {
      if (!toTestCombos.includes(k)) toTestCombos.push(k);
    });
  });

  let sumTingWong = 0;
  toTestCombos.forEach((womboCombo) => {
    let sum = 0;
    allNumsMap.forEach((map) => {
      if (map.has(womboCombo)) {
        sum += map.get(womboCombo)!;
      }
    });
    if (sum > sumTingWong) {
      sumTingWong = sum;
    }
  });
  //Sort allNumsMap to get the highest value return it
  return sumTingWong;
}
