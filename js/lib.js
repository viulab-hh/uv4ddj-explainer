import { h, render } from "https://esm.sh/preact@10";
import { useState, useEffect, useRef } from "https://esm.sh/preact@10/hooks";
import htm from "https://esm.sh/htm@3";
import scrollama from "https://esm.sh/scrollama@3";

export const html = htm.bind(h);
export { render, useState, useEffect, useRef, scrollama };
