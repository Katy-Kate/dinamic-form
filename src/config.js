export default async function getConfig(){
    return [
        {
            label:'Name',
            name:'name',
            required: true,
            type: 'text',
            value: 'Kate'
        },
        {
            label:'Password',
            name:'password',
            required: true,
            type: 'password',
            value: '123'
        },
        {
            label:'Email',
            name:'email',
            required: true,
            type: 'email',
            value: 'my-email@gmail.com'
        }
    ]
}
