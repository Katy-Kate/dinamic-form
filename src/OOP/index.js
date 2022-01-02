import React from 'react';
import getConfig from "../config"

class Fetcher {
    constructor(loader) {
        this.loader = loader
    }

    load(){
        return this.loader()
    }
}


class BaseField{
    label: '';
    name: '';
    value: '';
    required: false;
    type;

    get errorMessage(){
        return 'Invalid Field'
    }

    constructor({name, value, ...rest}){
       this.name = name;
       this.value = value;

       Object.assign(this, rest)
    }

    getName(){
        return this.name
    }

    getValue(){
        return this.value
    }

    setValue(value){
        this.value = value;
        return value === this.value
    }

    isValid(){
        return true
    }

    validation(){
        const validationResult = this.isValid();

        if(validationResult){
            return null
        }

        return this.errorMessage
    }
}


class TextField extends BaseField{
    get errorMessage(){
        return 'Text Field is required'
    }

    isValid(): boolean {
        return this.required ? this.getValue().length > 0 : super.isValid()
    }
}

class PasswordField extends BaseField{
    get errorMessage(){
        return 'Password Field is required'
    }

    isValid(): boolean {
        return this.required ? this.getValue().length > 6 : super.isValid()
    }
}

class EmailField extends BaseField{
    get errorMessage(){
        return 'Email Field is required'
    }

    isValid(): boolean {
        return this.required ? this.getValue().includes('@') : super.isValid()
    }
}

class Form{
    static fieldTypes = {
        email: EmailField,
        password: PasswordField,
        text: TextField
    }

    constructor(fieldsConfig = {}) {
        this.fields = []
        this.config = []

        for (let key in fieldsConfig){
            this.config.push({
                name: key,
                value: fieldsConfig[key]
            })
        }

        this.createFormFields()
    }

    getField(index){
        return this.fields[index]
    }

    createFormFields(){
        for (let i = 0; i < this.config.length; i++){
            const fieldConfig = this.config[i]
            const Instance = Form.fieldTypes[fieldConfig.type]

            if (Instance){
                this.fields.push(new Instance(fieldConfig))
            } else {
                this.fields.push(new BaseField(fieldConfig))
            }
        }


    }

    getData(){
        const data = {}

        for (let i = 0; i < this.fields.length; i++){
            const field = this.fields[i];
            data[field.getName()] = field.getValue()
        }

        return data
    }

    getState(){
        return {
            data: this.getData(),
            config: this.config
        }
    }

    fill(formFields){
        this.fields = [];
        this.config = formFields

        this.createFormFields()
    }
}

class BaseInputComponent extends React.Component{
    renderFiled(){
        const {name='', value='', type='text', onChange} = this.props;

        return <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={e=>onChange(e.target.value)}
        />
    }

    renderLabel() {
        const {label='', name} = this.props;
        return <label htmlFor={name}>
            <span>{label}</span>
        </label>
    }

    renderError(){
        const {error} = this.props;

        if (error) {
            return <small>{error}</small>
        }
        return null;
    }

    render(){
        return (
            <div>
                {this.renderLabel()}
                {this.renderFiled()}
                {this.renderError()}
            </div>
        )
    }
}

class PasswordInputComponent extends BaseInputComponent {
    state = {
        showValue: true
    }

    onChange=()=>{
        this.setState(prevState => ({
            showValue: !prevState.showValue
        }))
    }

    renderFiled(){
        const {name='', value='', onChange} = this.props;

        return (
            <>
                {
                    this.state.showValue ?
                        super.renderFiled():
                            <input
                                id={name}
                                type='text'
                                name={name}
                                value={value}
                                onChange={e=>onChange(e.target.value)}>
                            </input>
                }
                <button onClick={this.onChange} type='button'>toggle</button>
            </>
        )
    }
}

class FormFieldComponent extends React.Component{
    static formFields = {
        text: BaseInputComponent,
        email: BaseInputComponent,
        password: PasswordInputComponent

    }

    render() {
        const Component = FormFieldComponent.formFields[this.props.type]
        return Component ? <Component {...this.props} /> : null;
    }
}


class OOP extends React.Component{
    form = new Form({
        name: '22131',
        password: '23',
        email: '123'
    })

    fetcher = new Fetcher(getConfig)

    constructor() {
        super();
        this.state = this.form.getState()
    }

    componentDidMount() {
        this.fetcher.load().then(formFields => {
            this.form.fill(formFields)
            this.setState(this.form.getState())
        })
    }

    render() {
        console.log(this.state.data)
        return (
                <div>
                    {
                        this.form.config.map((formConfig,i) => {
                            return <FormFieldComponent
                                    key={formConfig.name}
                                    {...formConfig}
                                    value={this.state.data[formConfig.name]}
                                    onChange={ value => {
                                        const field = this.form.getField(i)
                                        //field.setValue(value)
                                        this.setState({...this.form.getState(),
                                            data: {
                                            ...this.form.getState().data,
                                            [field.name]:value
                                            }
                                        })

                                    }}
                            />
                        })
                    }
                </div>
            )
    }
}

export default OOP
