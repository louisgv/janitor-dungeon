import React, { useState, useEffect } from "react";

import styled from 'styled-components';

interface TriangleProps {
    size: string;
    color: string;
}
  
const BasicTriangle = styled.div`
    width: 0; 
    height: 0; 
`;

const UpTriangle = styled(BasicTriangle)<TriangleProps>`
  border-left: ${p => p.size} solid transparent;
  border-right: ${p => p.size} solid transparent;  
  border-bottom: ${p => p.size} solid ${p => p.color};
`
const DownTriangle = styled(BasicTriangle)<TriangleProps>`
  border-left: ${p => p.size} solid transparent;
  border-right: ${p => p.size} solid transparent;
  
  border-top: ${p => p.size} solid ${p => p.color};
`

const RightTriangle = styled(BasicTriangle)<TriangleProps>`
    border-top: ${p => p.size} solid transparent;
    border-bottom: ${p => p.size} solid transparent;
    border-left: ${p => p.size} solid ${p => p.color};
`

const LeftTriangle = styled(BasicTriangle)<TriangleProps>`
  border-top: ${p => p.size} solid transparent;
  border-bottom: ${p => p.size} solid transparent; 
  border-right:${p => p.size} solid ${p => p.color}; 
`

const Triangles = [
    UpTriangle,
    DownTriangle,
    LeftTriangle,
    RightTriangle
]

export const getRandomTriangle =()=> Triangles[Math.floor((Math.random() * 4))];