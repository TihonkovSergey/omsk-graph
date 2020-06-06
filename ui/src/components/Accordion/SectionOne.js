import React, { useState } from "react";
import {
  Collapse,
  Space,
  Button,
  Typography,
  InputNumber,
  Divider,
} from "antd";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";

import { api } from "../../api";
import { selectedInfraState, selectedHousesState } from "../../store/selection";
import { pathsAtom } from "../../store/paths";
import { task11Atom, maxTimeState, maxDistanceState } from "../../store/task11";
import { activeTaskAtom } from "../../store/general";

const { Panel } = Collapse;
const { Text } = Typography;

export const SectionOne = () => {
  const [maxDistance, setMaxDistance] = useRecoilState(maxDistanceState);
  const [maxTime, setMaxTime] = useRecoilState(maxTimeState);
  const [isLoading, setIsLoading] = useState(false);

  const selectedHouses = useRecoilValue(selectedHousesState);
  const selectedInfra = useRecoilValue(selectedInfraState);
  const setPaths = useSetRecoilState(pathsAtom);
  const set11 = useSetRecoilState(task11Atom);
  const setTask = useSetRecoilState(activeTaskAtom);

  return (
    <Space direction="vertical" className="section" size="small">
      <Text>Оценка удобства размещения объектов инфраструктуры города</Text>
      <Collapse accordion>
        <Panel header="1.1 Ближайшие узлы и объекты" key="1" class="panel">
          <Space>
            В радиусе
            <InputNumber
              min={0}
              formatter={(value) => `${value} м`}
              parser={(value) => value.split(" ")[0]}
              value={maxDistance}
              onChange={setMaxDistance}
            />
            или
            <InputNumber
              min={0}
              formatter={(value) => `${value} мин`}
              parser={(value) => value.split(" ")[0]}
              value={maxTime}
              onChange={setMaxTime}
            />
            <Button
              type="primary"
              loading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                const result = await api("1.1", {
                  houses: selectedHouses,
                  infra: selectedInfra,
                  maxTime: maxTime,
                  maxDistance: maxDistance,
                });
                setIsLoading(false);

                if (result) {
                  setPaths(result.paths);
                  set11(result);
                  setTask("1.1b");
                }
              }}
            >
              Найти
            </Button>
          </Space>
          <Divider>Или</Divider>
          <Button
            loading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              const result = await api("1.1", {
                houses: selectedHouses,
                infra: selectedInfra,
              });
              setIsLoading(false);

              if (result) {
                setPaths(result.paths);
                set11(result);
                setTask("1.1a");
              }
            }}
          >
            Найти независимо от расстояния
          </Button>
        </Panel>
        <Panel header="1.2 Минимальное расстояние до дальнего дома" key="2" />
        <Panel header="1.3 Сумма кратчайших расстояний" key="3" />
        <Panel header="1.4 Найти минимальное дерево кратчайших путей" key="4" />
      </Collapse>
    </Space>
  );
};
