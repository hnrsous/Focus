export async function login({ email, password }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password.length >= 6) {
                resolve({ uid: 'mock-uid', email })
            } else {
                reject(new Error('Credenciais inválidas.'))
            }
        }, 900)
    })
}

export async function register({ name, email, password }) {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (name && email && password.length >= 6) {
                resolve({ uid: 'mock-uid', email, displayName: name })
            } else {
                reject(new Error('Preencha todos os campos corretamente.'))
            }
        }, 900)
    })
}

export async function recoverPassword({ email }) {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email) {
                resolve()
            } else {
                reject(new Error('Informe um e-mail válido.'))
            }
        }, 900)
    })
}