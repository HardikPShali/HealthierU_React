import React from "react";
import { useState, useEffect } from 'react';
import ModalService from './ModalService';
import styles from './ModalRoot.module.css';

export default function ModalRoot(props) {

    const [modal, setModal] = useState({});

    useEffect(() => {
        ModalService.on('open', ({ component, props }) => {
            setModal({
                component,
                props,
                close: value => {
                    setModal({});
                },
            });
        });
    }, []);
 

    const ModalComponent = modal.component ? modal.component : null;

    return (
        <section className={modal.component ? styles.modalRoot : ''}>

            {ModalComponent && (
                <ModalComponent
                    {...modal.props}
                   
                    componentName={props.componentName}
                    handleDeleteSubmit={props.handleDeleteSubmit}
                    // close={modal.close}
                    handleState={props.handleState || modal.close}
                    className={ModalComponent ? 'd-block' : ''}
                />
            )}

        </section>
    );
}