window.OPENFLYSCAN_CONFIG = {
  sceneCatalog: 'static/scenes.json',
  viewerBase: 'https://gs.openflygo.com/openflyscan/releases/20260921/viewer/',
  links: {
    arxiv: 'https://arxiv.org/abs/2609.24253',
    code: 'https://github.com/mistletoe235/OpenFlyScan',
    app: 'https://github.com/mistletoe235/OpenFlyGo-Android-V5',
    datasets: 'https://huggingface.co/datasets/mistletoe235/openflyscan/tree/main/HIL-simulator'
  },
  scenes: [
    {
      id: 'expo-east',
      name: 'Expo East',
      description: 'An urban site reconstructed from real aerial captures.',
      poster: 'static/images/expo-east.webp',
      viewerUrl: 'https://gs.openflygo.com/openflyscan/releases/20260921/viewer/?scene=expo-east&embed=1'
    },
    {
      id: 'expo-west',
      name: 'Expo West',
      description: 'The real-world site used for our targeted reacquisition experiment.',
      poster: 'static/images/expo-west.webp',
      viewerUrl: 'https://gs.openflygo.com/openflyscan/releases/20260921/viewer/?scene=expo-west&embed=1'
    }
  ]
};
