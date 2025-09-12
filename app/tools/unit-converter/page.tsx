'use client';

import { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card } from 'react-bootstrap';

interface UnitCategory {
  name: string;
  units: { [key: string]: number }; // unitName: conversionFactorToBaseUnit
}

const unitCategories: UnitCategory[] = [
  {
    name: 'Length',
    units: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      mile: 1609.34,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
    },
  },
  {
    name: 'Mass',
    units: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      pound: 0.453592,
      ounce: 0.0283495,
      tonne: 1000,
    },
  },
  {
    name: 'Temperature',
    units: {
      celsius: 1,
      fahrenheit: 1,
      kelvin: 1,
    }, // Special handling for temperature conversions
  },
  {
    name: 'Volume',
    units: {
      liter: 1,
      milliliter: 0.001,
      'cubic meter': 1000,
      gallon: 3.78541,
      quart: 0.946353,
      pint: 0.473176,
    },
  },
];

export default function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState<string>(unitCategories[0].name);
  const [inputValue, setInputValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const category = unitCategories.find(cat => cat.name === selectedCategory);
    if (category) {
      const firstUnit = Object.keys(category.units)[0];
      setFromUnit(firstUnit);
      setToUnit(firstUnit);
    }
  }, [selectedCategory]);

  useEffect(() => {
    convertUnits();
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  const convertUnits = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      setResult('');
      return;
    }

    const category = unitCategories.find(cat => cat.name === selectedCategory);
    if (!category || !fromUnit || !toUnit) {
      setResult('');
      return;
    }

    let convertedValue: number;

    if (selectedCategory === 'Temperature') {
      // Special handling for temperature
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        convertedValue = (numValue * 9) / 5 + 32;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        convertedValue = ((numValue - 32) * 5) / 9;
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        convertedValue = numValue + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        convertedValue = numValue - 273.15;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        convertedValue = ((numValue - 32) * 5) / 9 + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        convertedValue = ((numValue - 273.15) * 9) / 5 + 32;
      } else {
        convertedValue = numValue; // Same unit
      }
    } else {
      // General conversion for other categories
      const baseValue = numValue * category.units[fromUnit];
      convertedValue = baseValue / category.units[toUnit];
    }

    setResult(convertedValue.toFixed(4));
  };

  const currentUnits = unitCategories.find(cat => cat.name === selectedCategory)?.units || {};

  return (
    <main>
      <Container className="mt-5">
        <h1 className="text-center mb-4">Unit Converter</h1>

        <Card as="section" className="mb-4">
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Category</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Select unit category"
              >
                {unitCategories.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>From Unit</Form.Label>
                  <Form.Control
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    aria-label="Value to convert"
                  />
                  <Form.Select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="mt-2"
                    aria-label="From unit"
                  >
                    {Object.keys(currentUnits).map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>To Unit</Form.Label>
                  <Form.Control
                    type="text"
                    value={result}
                    readOnly
                    placeholder="Result"
                    aria-label="Conversion result"
                  />
                  <Form.Select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="mt-2"
                    aria-label="To unit"
                  >
                    {Object.keys(currentUnits).map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}
