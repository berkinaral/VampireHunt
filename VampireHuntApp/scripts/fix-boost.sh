#!/bin/bash

# Fix boost checksum issue in React Native
echo "🔧 Fixing boost podspec checksum..."

BOOST_PODSPEC="node_modules/react-native/third-party-podspecs/boost.podspec"

if [ -f "$BOOST_PODSPEC" ]; then
    # Update to use local file if it exists
    if [ -f "/tmp/boost_1_76_0.tar.bz2" ]; then
        cat > "$BOOST_PODSPEC" << 'EOF'
# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

Pod::Spec.new do |spec|
  spec.name = 'boost'
  spec.version = '1.76.0'
  spec.license = { :type => 'Boost Software License', :file => "LICENSE_1_0.txt" }
  spec.homepage = 'http://www.boost.org'
  spec.summary = 'Boost provides free peer-reviewed portable C++ source libraries.'
  spec.authors = 'Rene Rivera'
  spec.source = { :http => 'file:///tmp/boost_1_76_0.tar.bz2' }
  
  # Pinning to the same version as React.podspec.
  spec.platforms = { :ios => '11.0' }
  spec.requires_arc = false

  spec.module_name = 'boost'
  spec.header_dir = 'boost'
  spec.preserve_path = 'boost'
end
EOF
        echo "✅ Boost podspec updated to use local file"
    else
        echo "⚠️  Local boost file not found, skipping"
    fi
else
    echo "⚠️  Boost podspec not found (will be created when pods are installed)"
fi
