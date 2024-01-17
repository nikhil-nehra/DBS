import React, { ChangeEvent, MouseEvent } from 'react';

type FormProps = {
    username: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    connect: (e: MouseEvent<HTMLButtonElement>) => void;
};

function Form(props: FormProps): JSX.Element {
    return (
        <form>
            <input
                placeholder='Username...'
                type='text'
                value={props.username}
                onChange={props.onChange}
            />
            <button onClick={props.connect}>Connect</button>
        </form>
    );
}

export default Form;