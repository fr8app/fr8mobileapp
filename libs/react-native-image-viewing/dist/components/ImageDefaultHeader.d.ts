/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
declare type Props = {
    onRequestClose: () => void;
    openActionSheet: () => void;
};
declare const ImageDefaultHeader: ({ onRequestClose,openActionSheet }: Props) => JSX.Element;
export default ImageDefaultHeader;
