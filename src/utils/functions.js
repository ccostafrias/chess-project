export function isBetween(less, bet, great) {
    return !!(less <= bet && bet <= great)
}

export function closer(v1, v2, ref) {
    return Math.abs(v1 - ref) < Math.abs(v2 - ref) ? v1 : v2;
}

export function notationToIndex(notation) {
    if (notation === '-') return {}
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const [first, second] = notation.split('')
    const c = letters.indexOf(first)
    const r = 8-Number(second)
    const i = r*8+c
    return {r, c, i}
}

export function fenConverter(array) {
    // Cria uma string concatenando os valores da chave 'p' de cada objeto
    let str = array.map(obj => obj.p).join('');
    let result = ''
    
    // Processa a string em blocos de 8 caracteres
    for (let i = 0; i < str.length; i += 8) {
        // Extrai um bloco de 8 caracteres ou menos
        let chunk = str.slice(i, i + 8);
        
        // Substitui sequências de zeros consecutivos pelo seu comprimento
        chunk = chunk.replace(/0+/g, match => match.length);
        
        // Adiciona o bloco processado ao resultado
        result += chunk + '/';
    }
    
    // Remove a barra final desnecessária
    if (result.endsWith('/')) {
        result = result.slice(0, -1);
    }
    
    return result;
}

export function numberToItem(arr) {
    const array = Array.isArray(arr) ? arr : Array.from(arr)
    return array.reduce((acc, curr) => {
        const num = Number(curr)
        if (!num) return [...acc, curr]
        else {
            const empties = Array.from(Array(num), (_) => '0')
            return acc.concat(empties)
        }
    }, [])
}

export function isCapitalize(str) {
    return str.toUpperCase() === str ? true : false
}