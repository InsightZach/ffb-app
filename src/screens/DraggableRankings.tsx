import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useRankingsStore } from '../store/rankingsStore';

type Player = {
  id: string;
  name: string;
  pos: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
  team?: string;
};

export default function DraggableRankings() {
  const { rankings, setRankings, ensureSeed } = useRankingsStore();

  React.useEffect(() => {
    ensureSeed();
  }, [ensureSeed]);

  const keyExtractor = useCallback((item: Player) => item.id, []);

  const renderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<Player>) => {
      const index = getIndex?.() ?? 0;
      return (
        <View
          onLongPress={drag}
          style={[styles.row, isActive && styles.activeRow] as any}
        >
          <Text style={styles.rank}>{index + 1}</Text>
          <View style={styles.meta}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sub}>
              {item.pos}
              {item.team ? ` • ${item.team}` : ''}
            </Text>
          </View>
        </View>
      );
    },
    []
  );

  const data = useMemo(() => rankings, [rankings]);

  return (
    <DraggableFlatList
      containerStyle={styles.list}
      data={data}
      keyExtractor={keyExtractor}
      onDragEnd={({ data: newData }) => setRankings(newData)}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#0b1220',
  },
  activeRow: {
    backgroundColor: '#111a2e',
  },
  rank: {
    width: 36,
    color: '#7aa2ff',
    fontWeight: '700',
  },
  meta: {
    flex: 1,
  },
  name: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
});

