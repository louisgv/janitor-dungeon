import React, { useState, useEffect } from "react";

import styled from 'styled-components';

interface CircleProps {
    size: string;
    color: string;
}

export default styled.div<CircleProps>`
    width: ${ p => p.size };
    height: ${ p => p.size };

    background: ${p => p.color};
    border-radius: 100%;
`;