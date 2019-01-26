import {Machine} from 'xstate';

export const petStateMachine = Machine({
    id: 'pet',
    initial: 'idle',
    states: {
        idle: {
            on: {

            }
        },
        waving: {

        }
    }
})