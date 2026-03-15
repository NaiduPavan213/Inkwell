declare module 'react-quill-new' {
    import React from 'react';
    export interface ReactQuillProps {
        theme?: string;
        value?: string;
        onChange?: (content: string) => void;
        className?: string;
        modules?: any;
        formats?: string[];
        placeholder?: string;
        readOnly?: boolean;
    }
    export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
