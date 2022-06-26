import axios from "axios"

function login() {
    return <>
        <h1>Login</h1>
        <form onSubmit={(e) => {
            e.preventDefault()
            const formdata = new FormData()
            axios.post("/api/login", formdata).then(res => {
                console.log(res)
            })
        }}>
            <label>
                Username:
                <input type="text" name="username" />
            </label>
            <label>
                Password:
                <input type="password" name="password" />
            </label>
            <input type="submit" value="Submit" />
        </form>
    </>
}