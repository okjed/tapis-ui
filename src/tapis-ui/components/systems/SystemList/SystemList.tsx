import React, { useState, useCallback } from 'react';
import { useList } from 'tapis-hooks/systems';
import { TapisSystem } from '@tapis/tapis-typescript-systems';
import { Icon } from 'tapis-ui/_common';
import { TapisUIComponent } from 'tapis-ui/components';
import './SystemList.scss';

export type OnSelectCallback = (system: TapisSystem) => any;

interface SystemItemProps {
  system: TapisSystem,
  select: Function
  selected: boolean,
}


const SystemItem: React.FC<SystemItemProps> = ({ system, select, selected = false}) => {
  return (
    <li className="nav-item">
      <div className={"nav-link" + (selected ? ' active' : '')}>
        <div className="nav-content" onClick={() => select(system) }>
          <Icon name="data-files" />
          <span className="nav-text">{`${system.id} (${system.host})`}</span>
        </div>
      </div>
    </li>
  );
};

interface SystemListProps {
  onSelect?: OnSelectCallback | null,
  className?: string
}

const SystemList: React.FC<SystemListProps> = ({ onSelect=null, className=null }) => {

  // Get a systems listing with default request params
  const { data, isLoading, error } = useList({});

  const definitions: Array<TapisSystem> = data?.result || [];
  const [currentSystem, setCurrentSystem] = useState(String);
  const select = useCallback((system) => {
    onSelect && onSelect(system);
    setCurrentSystem(system.id)
  },[onSelect, setCurrentSystem]);

  return (
    <TapisUIComponent isLoading={isLoading} error={error} className={className ?? "system-list nav flex-column"}>
      {
        definitions.length
          ? definitions.map(
              (system) => system && <SystemItem
                            system={system}
                            selected={currentSystem === system.id}
                            select={select}
                            key={system.id}
                          />
            )
          : <i>No systems found</i>
      }
    </TapisUIComponent>
  )
};

export default SystemList;
