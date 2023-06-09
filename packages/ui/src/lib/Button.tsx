import styled from 'styled-components';

const Button = styled.button`
    border: none;
    border-radius: 0.5rem;
    background-color: #ffffff;
    color: #000000;
    padding: 0.75rem;
    cursor: pointer;
    &:hover {
        background-color: #0a558c;
    }
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #62b0e8;
        background-color: #0a558c;
    }
`;

export default Button;