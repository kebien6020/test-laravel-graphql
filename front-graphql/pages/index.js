import { useState, useEffect } from 'react'
import { request } from 'graphql-request'

const loginQuery = `
    mutation ($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            success
            error {
                message
                code
            }
        }
    }
`

const meQuery = `
    {
        me {
            name
        }
    }
`

const LoginForm = ({onLogin}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { success = false } = await request('/graphql', loginQuery, {
            email,
            password,
        })

        if (data.success === true) onLogin()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='email'>Email: </label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                />
            </div>
            <div>
                <label htmlFor='email'>Password: </label>
                <input
                    type='password'
                    id='password'
                    name='password'
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />
            </div>
            <button type='submit'>Iniciar Sesion</button>
            <style jsx>{`
                label {
                    font-weight: bold;
                }
            `}</style>
        </form>
    )
}

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        (async () => {
            if (user) return

            const { me = null } = await request('/graphql', meQuery)
            if (me) {
                setLoggedIn(true)
                setUser(me)
            }
        })()
    }, [loggedIn])

    return (loggedIn ? <>
        {user ? <>
            <h2>Hola {user.name}</h2>
        </> : <>
            Cargando…
        </>
        }
    </> : <>
        <LoginForm onLogin={() => setLoggedIn(true)} />
    </>)
}

export default Home
