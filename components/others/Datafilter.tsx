import * as React from 'react';
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Popover, {PopoverActions} from '@mui/material/Popover'
import Button from '@mui/material/Button'
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import TransitionGroup from 'react-transition-group/TransitionGroup'


export interface InputComponentProps<ValueType> {
  value?: ValueType;
  onChange?: (newValue: ValueType) => void;
}

export type InputComponent<ValueType> = React.JSXElementConstructor<
  InputComponentProps<ValueType>
>;

function truncate(str: string, max = Infinity): string {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

const DEFAULT_FORMAT_VALUE = (value: any) => {
  const formatted = String(value);
  return truncate(formatted, 20);
};

interface Operator<ValueType> {
  operator: string;
  label?: string;
  defaultValue: ValueType;
  acceptValue?: (value?: ValueType) => boolean;
  formatValue?: (value: ValueType) => string;
  InputComponent: InputComponent<ValueType>;
}

interface OptionParams<ValueType> {
  operators: readonly Operator<any>[];
  label?: string;
}

export interface Option<Field, ValueType> extends OptionParams<ValueType> {
  field: Field;
}

export interface FilterValue<Field> {
  field: Field;
  operator: string;
  value: any;
}

export type OptionOf<Row extends object> = {
  [Key in keyof Row]: Option<Key, Row[Key]>;
}[keyof Row];

export type FilterValueOf<Row extends object> = {
  [Key in keyof Row]: FilterValue<Key>;
}[keyof Row];

function StringInputComponent({
  value,
  onChange,
}: InputComponentProps<string>) {
  return (
    <TextField
      autoFocus
      size="small"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  );
}

function NumberInputComponent({
  value,
  onChange,
}: InputComponentProps<number>) {
  return (
    <TextField
      type="number"
      autoFocus
      size="small"
      value={value}
      onChange={(event) => onChange?.(Number(event.target.value))}
    />
  );
}

export function stringCompareOperator(
  operator: string,
  label?: string
): Operator<string> {
  return {
    operator,
    label,
    defaultValue: '',
    acceptValue: (value) => !!value,
    formatValue: (value: string) => `"${truncate(value, 20)}"`,
    InputComponent: StringInputComponent,
  };
}

export const TYPE_STRING: OptionParams<string> = {
  operators: [
    stringCompareOperator('contains'),
    stringCompareOperator('equals'),
    stringCompareOperator('startsWith', 'starts with'),
    stringCompareOperator('endsWith', 'ends with'),
  ],
};

export function numericCompareOperator(
  operator: string,
  label?: string
): Operator<number> {
  return {
    operator,
    label,
    defaultValue: 0,
    InputComponent: NumberInputComponent,
  };
}

export const TYPE_NUMBER: OptionParams<number> = {
  operators: [
    numericCompareOperator('='),
    numericCompareOperator('>'),
    numericCompareOperator('<'),
    numericCompareOperator('>=', '≥'),
    numericCompareOperator('<=', '≤'),
  ],
};

interface OptionEditorProps<Row extends object, Option extends OptionOf<Row>> {
  value: FilterValueOf<Row>;
  onChange: (newValue: FilterValueOf<Row>) => void;
  option: Option;
  onClose?: () => void;
  okButtonText?: string;
}

function OptionEditor<Row extends object, Option extends OptionOf<Row>>({
  value,
  onChange,
  option,
  onClose,
  okButtonText,
}: OptionEditorProps<Row, Option>) {
  const [operatorIdx, setOperatorIdx] = React.useState(0);

  const { InputComponent, acceptValue } = option.operators[operatorIdx];

  const [input, setInput] = React.useState<FilterValueOf<Row>>(value);
  React.useEffect(() => setInput(value), [value]);

  const canSubmit = React.useMemo(
    () => (acceptValue ? acceptValue(input.value) : true),
    [acceptValue, input.value]
  );
  const handleSubmit = React.useCallback(
    () => (canSubmit ? onChange?.(input) : null),
    [canSubmit, onChange, input]
  );

  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.code === 'Enter') {
        handleSubmit();
      } else if (event.code === 'Esc') {
        onClose?.();
      }
    },
    [handleSubmit]
  );

  return (
    <div onKeyPress={handleKeyPress}>
      <Stack direction="column">
        <Stack direction="row" alignItems="center" spacing={2} m={2} mb={1}>
          <Typography>{option.label}</Typography>{' '}
          <Select
            size="small"
            value={input.operator}
            onChange={(event) =>
              setInput((input) => ({ ...input, operator: event.target.value }))
            }
          >
            {option.operators.map(({ operator, label = operator }, i) => (
              <MenuItem key={operator} value={operator}>
                {label}
              </MenuItem>
            ))}
          </Select>
          <InputComponent
            value={input.value}
            onChange={(value) => setInput((input) => ({ ...input, value }))}
          />
        </Stack>
        <Box m={1} display="flex" justifyContent="flex-end">
          <Button onClick={onClose}>cancel</Button>
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {okButtonText}
          </Button>
        </Box>
      </Stack>
    </div>
  );
}

export interface DataFilterProps<Row extends object> {
  /**
   *  Available options for the filter
   */
  options: Readonly<OptionOf<Row>[]>;
  /**
   *  Actual filter value in controlled mode
   */
  value?: FilterValueOf<Row>[];
  /**
   *  Value change handler for controlled mode
   */
  onChange?: (newObject: FilterValueOf<Row>[]) => void;
  /**
   *  Filter chips size
   */
  size?: 'small' | 'medium';
}

/**
 * mui-plus DataFilter Component
 */
export default function DataFilter<Row extends object>({
  options,
  value = [],
  onChange,
  size,
}: DataFilterProps<Row>) {
  const popperRef = React.useRef<PopoverActions>(null);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const menuOpen = !!anchorEl;
  const [editedOption, setEditedOption] = React.useState<OptionOf<Row> | null>(
    null
  );

  const nextKey = React.useRef(0);
  const itemKeys = React.useRef(new WeakMap<object, string>());

  const optionsMap = React.useMemo(
    () => Object.fromEntries(options.map((option) => [option.field, option])),
    [options]
  );

  const [editedPart, setEditedPart] = React.useState<FilterValueOf<Row> | null>(
    null
  );

  const [editedIndex, setEditedIndex] = React.useState<number | null>(null);

  const handleCreateNew = React.useCallback((event: React.MouseEvent) => {
    setEditedOption(null);
    setEditedIndex(null);
    setAnchorEl(event.currentTarget);
  }, []);

  const handleEditorClose = () => {
    setAnchorEl(null);
  };

  const handleEditorSubmit = <K extends keyof Row>(
    field: K,
    operator: string,
    newValue: Row[K]
  ) => {
    const newItem = { field, operator, value: newValue };
    if (typeof editedIndex === 'number') {
      onChange?.(
        value.map((oldItem, i) => {
          if (i === editedIndex) {
            const oldKey = itemKeys.current.get(oldItem);
            if (typeof oldKey === 'string') {
              // assign the old item key to the new item
              itemKeys.current.delete(oldItem);
              itemKeys.current.set(newItem, oldKey);
            }
            return newItem;
          } else {
            return oldItem;
          }
        })
      );
    } else {
      onChange?.([...value, newItem]);
    }
    handleEditorClose();
  };

  const chipsContent = React.useMemo(() => {
    return value.map((item, index) => {
      let key = itemKeys.current.get(item);
      if (typeof key !== 'string') {
        key = `item-${nextKey.current++}`;
        itemKeys.current.set(item, key);
      }

      const handleEdit = (index: number) => (event: React.MouseEvent) => {
        setEditedIndex(index);
        setEditedOption(optionsMap[value[index].field as string]);
        setEditedPart(value[index]);
        setAnchorEl(event.currentTarget);
      };

      const handleDelete = (index: number) => () => {
        onChange?.(value.filter((_, i) => i !== index));
      };

      const option = optionsMap[item.field as string];
      const operator = option.operators.find(
        (op) => op.operator === item.operator
      );
      const formatValue = operator?.formatValue || DEFAULT_FORMAT_VALUE;

      const displayField = String(option.label || item.field);
      const displayOperator = operator?.label || item.operator;
      const displayValue = formatValue(item.value);

      return (
        <Collapse
          orientation="horizontal"
          key={itemKeys.current.get(item) || index}
          in
          mountOnEnter
          unmountOnExit
        >
          <Chip
            sx={{m: 2}}
            size={size}
            label={`${displayField} ${displayOperator} ${displayValue}`}
            onDelete={handleDelete(index)}
            onClick={handleEdit(index)}
          />
        </Collapse>
      );
    });
  }, [value, optionsMap, onChange, size]);

  const menuContent = React.useMemo(() => {
    return options.map((option, i) => {
      const handleClick = () => {
        setEditedOption(option);
        setEditedPart({
          field: option.field,
          operator: option.operators[0].operator,
          value: option.operators[0].defaultValue,
        } as FilterValueOf<Row>);
      };
      return (
        <MenuItem key={i} onClick={handleClick}>
          {option.label || option.field}
        </MenuItem>
      );
    });
  }, [options]);

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <TransitionGroup component={null}>{chipsContent}</TransitionGroup>
      <Chip
        sx={{borderStyle: 'dashed', m: 2}}
        size={size}
        icon={<AddIcon />}
        label="Add a filter"
        variant="outlined"
        onClick={handleCreateNew}
      />
      <Popover
        sx={{marginTop: 2}}
        action={popperRef}
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={handleEditorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {editedOption && editedPart ? (
          <OptionEditor<Row, OptionOf<Row>>
            value={editedPart}
            onChange={({ field, operator, value }) =>
              handleEditorSubmit(field, operator, value)
            }
            option={editedOption}
            okButtonText={typeof editedIndex === 'number' ? 'save' : 'add'}
            onClose={handleEditorClose}
          />
        ) : (
          <MenuList dense autoFocusItem>
            {menuContent}
          </MenuList>
        )}
      </Popover>
    </Box>
  );
}
